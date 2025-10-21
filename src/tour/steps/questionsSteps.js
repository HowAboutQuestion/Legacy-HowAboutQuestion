import { MediumTitle, LargeTitle, SmallContent, Code, TOOLTIP } from "tour/tourStyle.js"

export default function getQuestionsSteps() {
    return [
        {
            target: 'body',
            title: (
                <div>
                    <LargeTitle>
                        문제 관리 페이지에 오신걸 환영합니다
                    </LargeTitle>
                </div>
            ),
            content: (
                <div>
                    <SmallContent>
                        이곳에서는 내가 만든 문제를 한눈에 <strong>확인하고, 직접 생성, 수정, 삭제</strong>할 수 있는 공간입니다.
                    </SmallContent>
                    <SmallContent>
                        또한, 문제 <strong>가져오기 / 내보내기</strong> 기능을 통해 다른 사용자의 문제를 활용할 수도 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '[data-tour-id="question-root"]',
            content: (
                <div>
                    <MediumTitle>문제 관리 테이블</MediumTitle>
                    <SmallContent>내가 가진 문제가 이곳에 표시됩니다.</SmallContent>
                    <SmallContent>
                        문제를 <strong>생성, 수정, 삭제, 선택</strong>할 수 있으며,
                        체크박스를 통해 여러 기능을 조합해 활용할 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: "left-start",
            disableBeacon: true,
            floaterProps: { disableFlip: true },
        },
        {
            id: "tag-modal",
            target: '[data-tour-id="tag-name"]',
            content: (
                <div>
                    <MediumTitle>문제집 & 태그 선택</MediumTitle>
                    <SmallContent>
                        문제에 입력된 <strong>태그</strong>나 <strong>문제집 키워드</strong>를 이곳에서 확인할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        여러 태그를 선택하면, 해당 키워드를 포함한 문제들만 테이블에 표시됩니다.
                    </SmallContent>
                </div>
            ),
            placement: "right",
            disableBeacon: true
        },
        {
            target: '[data-tour-id="question-solve-add"]',
            content: (
                <div>
                    <MediumTitle>선택한 문제 풀기 & 문제 추가</MediumTitle>
                    <SmallContent>
                        체크박스로 선택한 문제를 풀거나, 나만의 <strong>새로운 문제</strong>를 만들 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: "left",
            disableBeacon: true,
            styles: TOOLTIP.md,
        },
        {
            target: '[data-tour-id="question-upload-download"]',
            content: (
                <div>
                    <MediumTitle>문제 가져오기 및 내보내기</MediumTitle>
                    <SmallContent>
                        외부에서 문제를 가져오거나, 선택한 문제를 파일로 내보낼 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true,
            styles: TOOLTIP.md,
        },
        {
            id: "in-insert-modal",
            target: '[data-tour-id="insert-modal-root"]',
            content: (
                <div>
                    <MediumTitle>문제 추가하기</MediumTitle>
                    <SmallContent>
                        이곳에서 새로운 문제를 <strong>직접 작성</strong>할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        제목이나 선택지 입력 중 <Code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>Enter</Code>를 누르면 자동으로 저장됩니다.
                    </SmallContent>
                    <SmallContent>
                        <Code>Tab</Code> 키와{' '}
                        <Code>Enter</Code> 키를 이용해 빠르고 효율적으로 문제를 제작해 보세요!
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
        {
            id: "lock",
            target: '[data-tour-id="insert-modal-tag"]',
            content: (
                <div>
                    <MediumTitle>태그 & 문제집 입력하기</MediumTitle>
                    <SmallContent>
                        쉼표(<Code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>,</Code>)로 구분하여 <strong>태그</strong>나 <strong>문제집 이름</strong>을 입력할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        문제 연속 생성 시 마지막으로 입력한 태그들은 자동으로 유지됩니다.
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
        {
            id: "lock",
            target: '[data-tour-id="insert-modal-select"]',
            content: (
                <div>
                    <MediumTitle>객관식 선택지 작성하기</MediumTitle>
                    <SmallContent>객관식 <strong>선택지</strong>를 작성할 수 있습니다.</SmallContent>
                    <SmallContent>
                        선택지 입력 시 <Code>`</Code>
                        혹은 <Code>```</Code>
                        를 사용해 코드 블록을 작성할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        <Code>Shift + End</Code>로 다음 줄로 이동하고, 이후에는{' '}
                        <Code>Enter</Code>로 간편하게 줄바꿈할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        더 큰 입력창이 필요하다면, <strong>확장 모드</strong>를 이용해보세요.
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
        {
            id: "lock",
            target: '[data-tour-id="insert-modal-answer"]',
            content: (
                <div>
                    <MediumTitle>객관식 정답 선택하기</MediumTitle>
                    <SmallContent>
                        이 버튼을 눌러 해당 문제의 <strong>정답</strong>을 지정할 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
        {
            id: "lock",
            target: '[data-tour-id="insert-modal-image"]',
            content: (
                <div>
                    <MediumTitle>이미지 추가하기</MediumTitle>
                    <SmallContent>
                        버튼을 눌러 이미지를 삽입하거나, 이미지를 드래그하여 끌어다 놓을 수도 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
        {
            id: "lock",
            target: '[data-tour-id="insert-modal-expend"]',
            content: (
                <div>
                    <MediumTitle>확장 모드</MediumTitle>
                    <SmallContent>
                        창이 작을 경우, 이 버튼을 눌러 <strong>확장 모드</strong>로 전환할 수 있습니다.
                    </SmallContent>
                    <SmallContent>
                        더 넓은 공간에서 설명이나 추가 내용을 작성할 수 있습니다.
                    </SmallContent>
                </div>
            ),
            placement: "bottom",
            disableBeacon: true
        },
    ];
}